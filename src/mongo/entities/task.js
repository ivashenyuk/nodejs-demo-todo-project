const mongoose = require('./../mongoose-connection');
const { Schema } = mongoose;
const TaskSchema = new Schema({
    summary: String,
    description: String,
    created: Date,
    updated: Date
});

// pre saving task
TaskSchema.pre('save', function (next) {
    const task = this;
    // update fields
    if (this.isNew) {
        task.created = new Date();
        task.updated = new Date();
        return next();
    } else {
        task.updated = new Date();
        return next();
    }
});


TaskSchema.methods.isValid = function () {
    if (this.summary && this.description) {
        return true;
    }
    return false;
}

module.exports = mongoose.model('Task', TaskSchema);