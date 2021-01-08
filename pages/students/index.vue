<template>
  <div>
    <h1>Hello, students</h1>
    <v-data-table :items="students" :headers="studentTableHeaders()">
      <template v-slot:top>
        <v-dialog v-model="dialogCreate" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Student
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New Student</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedStudent.name" label="Name" />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedStudent.email" label="Email" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCreate">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">
              Are you sure you want to delete this student?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteStudentConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <!--      <template v-slot:no-data>-->
      <!--        <v-btn color="primary" @click="initialize"> Reset </v-btn>-->
      <!--      </template>-->
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { IStudent } from '~/types/students'

@Component({
  computed: { ...mapState('students', ['students']) },
  async created() {
    await this.$store.dispatch('students/loadStudents')
  },
})
export default class StudentsIndex extends Vue {
  dialogCreate = false
  dialogDelete = false
  editedStudentIndex = -1
  defaultStudent: IStudent = { id: 0, name: '', email: '' }
  editedStudent: IStudent = { id: 0, name: '', email: '' }

  studentTableHeaders() {
    return [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
  }

  closeCreate() {
    this.dialogCreate = false
    this.$nextTick(() => {
      this.editedStudent = Object.assign({}, this.defaultStudent)
      this.editedStudentIndex = -1
    })
  }

  save() {
    this.$store.dispatch('students/addStudent', this.editedStudent)
    this.closeCreate()
  }

  deleteItem(student: IStudent) {
    this.editedStudentIndex = student.id
    this.editedStudent = Object.assign({}, student)
    this.dialogDelete = true
  }

  closeDelete() {
    this.dialogDelete = false
    this.$nextTick(() => {
      this._resetEditedStudent()
    })
  }

  async deleteStudentConfirm() {
    await this.$store.dispatch('students/deleteStudent', this.editedStudent)
    this.closeDelete()
  }

  _resetEditedStudent() {
    this.editedStudent = Object.assign({}, this.defaultStudent)
    this.editedStudentIndex = -1
  }
}
</script>
