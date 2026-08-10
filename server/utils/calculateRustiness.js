
const calculateRustiness = (skill) => {
    // find the latest practice date (fallback: very old date if none)
    const mostRecentEntry = skill.practiceLog.reduce((latest, entry) => {
        return entry.date > latest.date ? entry : latest;
    }, { date: new Date(0) });
    // never practiced = fully rusty
    if (mostRecentEntry.date.getTime() === new Date(0).getTime()) {
        return 1;
    }
    // days since last practice
    const today = new Date();
    const daysSincePractice = Math.floor(
        (today - mostRecentEntry.date) / (1000 * 60 * 60 * 24)
    );
    // more practice = slower decay
    const decayRate = 1 / (skill.practiceLog.length + 1);
    // forgetting-curve formula: 0 = fresh, 1 = rusty
    const rustiness = 1 - Math.exp(-decayRate * daysSincePractice / 30);
    // keep result between 0 and 1
    return Math.min(1, Math.max(0, rustiness));
}

module.exports = {
    calculateRustiness
};