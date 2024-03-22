const userModel = require("../models/userModel")
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter;
const getUserPreferences = async(req,res)=>{
    try{
    const users = await userModel.find({}, 'username interestsHistory');
        const csvWriter = createObjectCsvWriter({
            path: 'user_interests.csv',
            header: [
                { id: 'username', title: 'user' },
                { id: 'interestsHistory', title: 'interestsHistory' }
            ]
        });
        const records = users.map(user => ({
            username: user.username,
            interestsHistory: user.interestsHistory.join(', ')
        }));
        await csvWriter.writeRecords(records);

        res.status(200).download('user_interests.csv');
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {getUserPreferences}