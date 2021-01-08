import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { IStudent } from '~/types/students'
import { $axios } from '~/utils/api'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'students',
})
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
    await $axios.$get('/students/').then((res) => {
      this.context.commit('setStudents', res)
    })
  }

  @Action({ rawError: true })
  async saveStudent(student: IStudent) {
    await $axios.$post('/students/', student).then((res) => {
      this.context.commit('addStudent', res)
    })
  }

  @Action({ rawError: true })
  async deleteStudent(student: IStudent) {
    await $axios.$delete(`/students/${student.id}`).then(() => {
      this.context.commit('removeStudent', student)
    })
  }
}
