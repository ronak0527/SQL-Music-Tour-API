//DEPENDENCIES
const bands = require('express').Router();
const db = require('../models');
const band = require('../models/band');
const {Op, where} = require('sequelize');
const { Band, MeetGreet, Event, Set_Time} = db;
//FIND ALL BANDS
bands.get('/', async (req, res) => {
   try{
       const foundBands = await Band.findAll({
           order: [['available_start_time', 'ASC']],
           where: {
               name: {[Op.like]: `%${req.query.name ? req.query.name: ''}%`}
           }
       })
       res.status(200).json(foundBands)
   } catch (error) {
       res.status(500).json(error)
   }
})
//FIND A SPECIFIC BAND
bands.get('/:name', async(req, res) => {
   try{
        const foundBands = await Band.findOne({
           where: { name: req.params.name },
           include: [
               {
                   model: MeetGreet, 
                   as: 'meet-greets',
                   include: {model: Event, as: 'event',
                   where: {name:{ [Op.like]: `%${req.query.event ? req.query.event: ''}%`}}
               }
            },
            {
               model: Set_Time,
               as: 'set-times',
               include:{ model: Event, as: 'event',
               where: {name:{ [Op.like]: `%${req.query.event ? req.query.event: ''}%`}}}
            }  
           ]
        })
        res.status(200).json(foundBands)
   } catch (error) {
       res.status(500).json(error)
        
   }
})
//CREATE A BAND
bands.post('/', async(req, res) => {
   try{
      const newBand = await Band.create(req.body)
      res.status(200).json({
       message: 'successfully inserted a new band',
       data:  newBand
      })
   } catch(error) {
      res.status(500).json(error)
   }
})
//UPDATE A BAND
bands.put('/:id', async(req, res) => {
    try{ 
       const updateBands = await Band.update(req.body, {
           where: {
               band_id: req.params.id
           }
       })
           res.status(200).json({
              message: `successfully updated ${updateBands} band(s)`
           })
       

    }catch(error) {
            res.status(200).json(error)
    }
})
// DELETE A BAND
bands.delete('/:id', async (req, res) => {
   try {
       const deletedBands = await Band.destroy({
           where: {
               band_id: req.params.id
           }
       })
       res.status(200).json({
           message: `Successfully deleted ${deletedBands} band(s)`
       })
   } catch(err) {
       res.status(500).json(err)
   }
})




//EXPORT
module.exports = bands