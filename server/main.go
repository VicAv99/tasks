package main

import (
  "log"
  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/postgres"
)

// Data Model
type Task struct {
  Id          uint   `gorm:"primary_key" json:"id"`
  Description string `gorm:"not null"    json:"description"`
}

var db = initDB()

func initDB() *gorm.DB {
  db, err := gorm.Open("postgres", "host=postgres port=5432 dbname=public user=root sslmode=disable")
  db.LogMode(true)

  checkErr(err, "ERORR: on initDB")

  if !db.HasTable(&Task{}) {
    db.CreateTable(&Task{})
    db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Task{})
  }

  return db
}

func main() {
  // Initialize routes and use default cors
  routes := gin.Default()
  routes.Use(cors.Default())
  v1 := routes.Group("api/v1")
  {
    v1.POST("/tasks", postTask)
    v1.GET("/tasks", getTasks)
    v1.GET("/tasks/:id", getTask)
    v1.PUT("/tasks/:id", updateTask)
    v1.DELETE("/tasks/:id", deleteTask)
  }
  routes.Run(":8080")
}

func postTask(ctx *gin.Context) {
  var task Task
  ctx.Bind(&task)

  if task.Description != "" {
    db.Create(&task)
    ctx.JSON(201, gin.H{"data": task})
  } else {
    ctx.JSON(422, gin.H{"error": "Fields are empty"})
  }
}

func getTasks(ctx *gin.Context) {
  var tasks []Task

  db.Find(&tasks)

  ctx.JSON(200, gin.H{"data": tasks})
}

func getTask(ctx *gin.Context) {
  id := ctx.Params.ByName("id")
  var task Task

  db.First(&task, id)

  if task.Id != 0 {
      ctx.JSON(200, gin.H{"data": task})
  } else {
      ctx.JSON(404, gin.H{"error": "Task not found"})
  }
}

func updateTask(ctx *gin.Context) {
  id := ctx.Params.ByName("id")
  var task Task

  db.First(&task, id)

  if task.Description != "" {
    if task.Id != 0 {
      var newTask Task
      ctx.Bind(&newTask)

      result := Task{
        Id:          task.Id,
        Description: newTask.Description,
      }

      // UPDATE tasks SET firstname='newTask.Firstname', lastname='newTask.Lastname' WHERE id = task.Id;
      db.Save(&result)

      ctx.JSON(200, gin.H{"data": result})
    } else {
      ctx.JSON(404, gin.H{"error": "Task not found"})
    }
  } else {
    ctx.JSON(422, gin.H{"error": "Fields are empty"})
  }
}

func deleteTask(ctx *gin.Context) {
  id := ctx.Params.ByName("id")
  var task Task

  db.First(&task, id)

  if task.Id != 0 {
    // DELETE FROM tasks WHERE id = task.Id
    db.Delete(&task)

    ctx.JSON(200, gin.H{"data": "Task #" + id + " deleted"})
  } else {
    ctx.JSON(404, gin.H{"error": "Task not found"})
  }
}

// Helpers
func checkErr(err error, msg string) {
	if err != nil {
		log.Fatalln(msg, err)
	}
}
