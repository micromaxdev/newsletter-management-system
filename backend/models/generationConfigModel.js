const mongoose = require('mongoose');

const generationConfigSchema = new mongoose.Schema({
    folder: { type: String, required: true },
    tag: { type: String, required: true },

});

const GenerationConfig = mongoose.model('GenerationConfig', generationConfigSchema);

module.exports = GenerationConfig;