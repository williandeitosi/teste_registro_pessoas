<template>
  <div class="te">
    <FormUsers @update-table="atualizarTabela" />
    <TableUsers :users="users" />
  </div>
</template>

<script>
import FormUsers from "./components/FormUsers.vue";
import TableUsers from "./components/TableUsers.vue";

export default {
  name: "App",
  components: {
    TableUsers,
    FormUsers,
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async atualizarTabela(data) {
      try {
        console.log("Evento update-table capturado com novos dados:", data);
        this.users.push(data); // Adicionar o novo usuário ao array existente
        console.log("Dados da tabela atualizados:", this.users);
      } catch (error) {
        console.error("Erro ao atualizar a tabela: ", error);
      }
    },
  },
};
</script>

<style scoped>
.te {
  padding: 10px;
  width: 100%;
  height: 100vh;
  background-color: rgb(204, 204, 204);
}
</style>
