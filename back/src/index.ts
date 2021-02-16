import express from 'express';
import { Configure } from './server/configure';

const app = Configure(express());

app.listen(3333);
