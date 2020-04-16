---
description: >-
  Adicione leveis customizados ao seu servidor! Você pode customizar até 10
  leveis em seu servidor para que, quando alcançados, deem cargos e exibia uma
  mensagem personalizada!
---

# Recompensas de Role

### Adicionando leveis customizados

Para adicionar um level customizado, use:

```text
k!customlevel add <level> <role> <mensagem>
```

* &lt;level&gt; - Level que o usuário precisará alcançar.
* &lt;role&gt; - Role o usuário ganhará.
* &lt;mensagem&gt; - Mensagem que será exibida. **Caso não houver mensagem, será exibida a mensagem comum para todos os leveis escolhida pelo administrador ou a padrão da Kokia.**

#### Variáveis que podem ser utilizadadas na mensagem

* {user} - Username no servidor.
* {user.tag} - Tag do usuário. **Ex:** **user\#0000**
* {user.ping} - Cita o usuário na mensagem. **Ex: @user** 
* {level} - Level que o usuário alcançou.
* {role} - Role que o usuário ganhará ao alcançar este level.

{% tabs %}
{% tab title="Exemplo" %}
```text
k!customlevel add 5 @membro O {user.ping} alcançou o level {level} e agora é {role}!
```
{% endtab %}

{% tab title="Resultado" %}
O @user alcançou o level 5 e agora é membro!
{% endtab %}
{% endtabs %}

### 

### Removendo leveis customizados

Para remover um level customizado, use:

```text
k!customlevel remove <level>
```

Para remover todos os leveis customizados, use:

```text
k!customlevel remove all
```

### 

### Mostrando todos os leveis customizados

Para mostrar os leveis customizados, use:

```text
k!customlevel show
```

### 

### Alterar configurações de level customizado

Escolha se ao ganhar uma role elas serão acumulativas ou será substituída pela maior.

{% hint style="info" %}
Por padrão as roles são acumulativas!
{% endhint %}

Para substituir ao ganhar uma role, use:

```text
k!customlevel replace on
```

Para acumular ao ganhar uma role, use:

```text
k!customlevel replace off
```

