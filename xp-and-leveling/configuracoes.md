---
description: >-
  Altere o conteúdo e o canal em que será exibido a mensagem quando alguém do
  servidor subir de level!
---

# Configurações

### Alterando mensagem

```text
k!levelup custom <mensagem>
```

#### Variáveis que podem ser utilizadadas

* {user} - Username no servidor.
* {user.tag} - Tag do usuário. **Ex:** **user\#0000**
* {user.ping} - Cita o usuário na mensagem. **Ex: @user** 
* {level} - Level que o usuário alcançou.

{% tabs %}
{% tab title="Exemplo" %}
```text
k!levelup custom Parabéns, {user.ping}! Você alcançou o level {level}!
```
{% endtab %}

{% tab title="Resultado" %}
Parabéns, @user! Você alcançou o level 1!
{% endtab %}
{% endtabs %}

#### Retornando a mensagem padrão

Caso você queria que a Kokia retorne à sua mensagem padrão, use:

```text
k!levelup custom default
```



### Alterando canal

Para alterar o canal em que será exibida a mensagem, use:

{% hint style="warning" %}
Por padrão, a Kokia irá exibir a mensagem no canal em que o usuário estiver.
{% endhint %}

```text
k!levelup channel <channel>
```

Caso você queria que a Kokia volte ao seu padrão, use:

```text
k!level channel default
```



