const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//Idea Index page and fill it with all the ideas in mongoDB
router.get('/', (req,res) => {
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index',{
      ideas:ideas
    });
  });
});

//Add Idea form
router.get('/add', (req,res) => {
  res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

//Process the Form
router.post('/', (req, res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title, you little cunt'});
    }
    if(!req.body.details){
        errors.push({text:'Add some fuckin details you little weasel'});
    }
    if(errors.length > 0){
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details
      }
      new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
    }
});

// Edit form process - the big PUT request
router.put('/:id', (req,res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values - this is an edit afterall
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg','Video Idea Updated')
            res.redirect('/ideas');
        })
    });
});

//Delete idea
router.delete('/:id', (req,res) => {
    // Tutorial uses db.collection.remove() to delete, but its deprecated - use deleteOne instead
    Idea.deleteOne({_id: req.params.id})
    .then(()=> {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
});


module.exports = router;