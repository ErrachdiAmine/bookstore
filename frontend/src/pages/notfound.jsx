import React from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
export default function Notfound() { return <Container><section className="notfound"><p className="eyebrow">Error 404</p><h1 className="display">This page has<br/>lost its place.</h1><p>Let’s return you to a better chapter.</p><Link className="button button-primary" to="/">Back home</Link></section></Container> }
