const generationConfig = require('../models/generationConfigModel');

const createGenerationConfig = async (req, res) => {
    try {
        const { folder, tag } = req.body;
        const newConfig = new generationConfig({ folder, tag });
        const savedConfig = await newConfig.save();
        res.status(201).json(savedConfig);
    } catch (error) {
        res.status(500).json({ message: 'Error creating generation config', error });
    }
};

const getAllConfigs = async (req, res) => {
    try {
        const configs = await generationConfig.find();
        res.status(200).json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching generation configs', error });
    }
};    

const getConfigById = async (req, res) => {
    try {
        const config = await generationConfig.findById(req.params.id);
        if (!config) {
            return res.status(404).json({ message: 'Generation config not found' });
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching generation config', error });
    }  
};

const updateConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { folder, tag } = req.body;

        const updatedConfig = await generationConfig.findByIdAndUpdate(
            id,
            { folder, tag },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).json({ message: 'Generation config not found' });
        }

        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(500).json({ message: 'Error updating generation config', error });
    }
};

const deleteConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedConfig = await generationConfig.findByIdAndDelete(id);
        if (!deletedConfig) {
            return res.status(404).json({ message: 'Generation config not found' });
        }
        res.status(200).json({ message: 'Generation config deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting generation config', error });
    }
};

module.exports = {
    createGenerationConfig,
    getAllConfigs,
    getConfigById,
    updateConfig,
    deleteConfig
};