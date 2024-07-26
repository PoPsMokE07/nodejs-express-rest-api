const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const examples = [
    { id: 1, name: 'example1' },
    { id: 2, name: 'example2' },
    { id: 3, name: 'example3' }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/examples', (req, res) => {
    res.send(examples);
});

app.post('/api/examples', (req, res) => {
    // const schema={
    //     name:Joi.string().min(3).required()
    // };
    // const result=Joi.validate(req.body,schema);
    // // console.log(result);

    // if(result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    const { error } = validateExample(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const example = {
        id: examples.length + 1,
        name: req.body.name
    };
    examples.push(example);
    res.send(example);
});

app.put('/api/examples/:id', (req, res) => {
    const example = examples.find(c => c.id === parseInt(req.params.id));
    if (!example) return res.status(404).send('The given id was not valid');

    const { error } = validateExample(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    example.name = req.body.name;
    res.send(example);
});

app.delete('/api/examples/:id', (req, res) => {
    const example = examples.find(c => c.id === parseInt(req.params.id));
    if (!example) return res.status(404).send('The given id was not valid');

    const index = examples.indexOf(example);
    examples.splice(index, 1);
    res.send(example);
});

app.get('/api/examples/:id', (req, res) => {
    const example = examples.find(c => c.id === parseInt(req.params.id));
    if (!example) return res.status(404).send('The given id was not valid');
    res.send(example);
});

function validateExample(example) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(example);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
