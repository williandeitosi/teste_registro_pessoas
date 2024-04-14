<template>
  <div class="modal" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalhes do Usuário</h5>
          <button
            type="button"
            class="close btn btn-outline-danger"
            @click="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h3>Nome: {{ user.name }}</h3>
          <p>Gênero: {{ user.gender }}</p>
          <p>Data de Nascimento: {{ user.dataOfBirth }}</p>
          <p>Estado Civil: {{ user.maritalStatus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    user_id: Number,
  },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
  mounted() {
    axios
      .get(`http://localhost:3333/person/${this.user_id}`)
      .then((response) => {
        console.log(response.data);
        this.user = response.data;
        console.log("Dados atualizados:", this.user);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  },
};
</script>
