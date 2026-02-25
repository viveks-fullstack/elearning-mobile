import { getDashboardStats } from './dashboard.controller.js'

export default async function (app) {
    // Get dashboard statistics
    app.get('/stats', getDashboardStats)
}
