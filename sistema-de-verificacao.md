---
description: >-
  Utilizando o sistema de auto role e o de verificação, Kokia tem uma opção para
  que um membro novo no servidor precise ser verificado por um administrador
  antes que possa fazer alguma ação.
---

# Sistema de Verificação

### Exemplo de uso

Um servidor que seta uma auto role chamada **@não verificado** para que usuários com estas roles não possam ter acesso aos canais de texto ao entrar no servidor.

Usando o sistema de verificação, será dado ao usuário verificado a role **@verificado** para que, assim, ele possa ter acesso aos canais de texto do servidor.

### Adicionar role que será dada aos membros verificados

```text
k!verify set <role>
```

### Remover role

```text
k!verify remove
```

### Para verificar um membro

{% hint style="info" %}
Quando um mebro é verificado, a auto role que foi dada ao mesmo será retirada e será dada a role que foi setada em **k!verify set &lt;role&gt;**.
{% endhint %}

```text
k!verify <user>
```

