
class Utility {
    static randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    static matrix(width, height, valueInitializerCallback) {
        const matrix = [];
        const isFunction = typeof valueInitializerCallback === 'function';

        for (let x = 0; x < width; x++) {
            matrix[x] = [];
            for (let y = 0; y < height; y++) {
                matrix[x][y] = isFunction ? valueInitializerCallback(x, y, width, height) : undefined;
            }
        }

        return matrix;
    }
}
