function calculateCosineSimilarity(vectorA, vectorB) {
    const dotProduct = dotProductOfVectors(vectorA, vectorB);
    const magnitudeA = magnitudeOfVector(vectorA);
    const magnitudeB = magnitudeOfVector(vectorB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

function dotProductOfVectors(vectorA, vectorB) {
    return vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
}

function magnitudeOfVector(vector) {
    return Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
}

export default calculateCosineSimilarity;
