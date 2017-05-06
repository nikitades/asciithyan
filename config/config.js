const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
    app: {
        port: 3004,
        env
    }
}