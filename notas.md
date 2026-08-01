---
layout: default
title: "Notas — Derecho del Consumidor"
description: "Guías sobre derechos del consumidor en Argentina: planes de ahorro, bancos, fintech y débito automático."
permalink: /notas/
---

<style>
  .listado h1{font-family:var(--serif);font-weight:800;font-size:clamp(30px,5vw,40px);
              letter-spacing:-1px;margin:0 0 8px}
  .listado .lead{color:var(--tinta-70);margin:0 0 32px;font-size:16.5px;max-width:52ch}
  .item{border-top:1px solid var(--linea);padding:24px 0}
  .item:first-of-type{border-top:none}
  .item .eyebrow{font-family:var(--mono);font-size:10.5px;letter-spacing:2.2px;text-transform:uppercase;
                  color:var(--tierra);font-weight:600;margin:0 0 8px;opacity:.85}
  .item h2{font-family:var(--serif);font-weight:700;font-size:23px;letter-spacing:-.5px;margin:0 0 8px}
  .item h2 a{color:var(--tinta);text-decoration:none}
  .item h2 a:hover{color:var(--tierra-oscuro)}
  .item p{color:var(--tinta-70);font-size:15px;margin:0}
</style>

<div class="listado">
<h1>Notas sobre derechos del consumidor</h1>
<p class="lead">Guías claras, sin tecnicismos innecesarios, para consumidores de Posadas y toda la provincia de Misiones.</p>

{% for post in site.posts %}
<div class="item">
  <p class="eyebrow">{{ post.vertical }}</p>
  <h2><a href="{{ post.url | relative_url }}">{{ post.h1 | default: post.title }}</a></h2>
  <p>{{ post.description }}</p>
</div>
{% endfor %}
</div>
