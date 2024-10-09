const express = require('express');
const path = require('path')
const storeService = require('./store-service.js'); // Ensure this path is correct
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.redirect('/about')
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
     // Define the /shop route
     app.get('/shop', (req, res) => {
        storeService.getPublishedItems()
            .then((data) => {
                res.json(data); // Return the data as JSON
            })
            .catch((err) => {
                res.status(500).json({ message: err }); // Return error message
            });
    });

    // Define the /categories route
    app.get('/categories', (req, res) => {
        storeService.getCategories()
            .then((data) => {
                res.json(data); // Return the categories as JSON
            })
            .catch((err) => {
                res.status(500).json({ message: err }); // Return error message
            });
    });

    // Define the /shop/category/:id route
    app.get('/shop/category/:id', (req, res) => {
        const categoryId = parseInt(req.params.id, 10);
        storeService.getItemsByCategory(categoryId)
            .then((data) => {
                res.json(data); // Return items for the category as JSON
            })
            .catch((err) => {
                res.status(500).json({ message: err }); // Return error message
            });
    });

    // Define the /allItems route
    app.get('/items', (req, res) => {
        storeService.getAllItems().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).send("Unable to retrieve items.");
        });
    });


    
    // Handle 404 for unmatched routes
    app.use((req, res) => {
        res.status(404).send('Page Not Found');
    });
// Initialize the data
storeService.initialize()
    .then(() => {
   

        // Start the server
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize data:", err);
    });