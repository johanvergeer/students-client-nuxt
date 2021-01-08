import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import axios from 'axios'
import { IStudent } from '~/types/students'

@Module
export default class StudentsModule extends VuexModule {
  students: IStudent[] = []

  @Mutation
  setStudents(students: IStudent[]) {
    this.students = students
  }

  @Mutation
  addStudent(student: IStudent) {
    this.students.push(student)
  }

  @Mutation
  removeStudent(student: IStudent) {
    const index = this.students.findIndex((s) => s.id === student.id)
    this.students.splice(index, 1)
  }

  @Action
  async loadStudents() {
    await axios.get('http://localhost:8080/students/').then((res) => {
      this.context.commit('setStudents', res.data)
    })
  }

  @Action({ rawError: true })
  async saveStudent(student: IStudent) {
    await axios.post('http://localhost:8080/students/', student).then((res) => {
      this.context.commit('addStudent', res.data)
    })
  }

  @Action({ rawError: true })
  async deleteStudent(student: IStudent) {
    await axios
      .delete(`http://localhost:8080/students/${student.id}`)
      .then(() => {
        this.context.commit('removeStudent', student)
      })
  }
}
