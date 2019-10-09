module.exports = {
  name: 'taskify',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/taskify',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
