import axios from 'axios'
import { Commit } from 'vuex'
import { IStudent, IStudentsState } from '~/types/students'

export const state = () => ({
  students: [],
})

export const mutations = {
  setStudents(state: IStudentsState, students: IStudent[]) {
    state.students = students
  },
  addStudent(state: IStudentsState, student: IStudent) {
    state.students.push(student)
  },
  deleteStudent(state: IStudentsState, student: IStudent) {
    const index = state.students.findIndex((s) => s.id === student.id)
    state.students.splice(index, 1)
  },
}

export const actions = {
  async loadStudents({ commit }: { commit: Commit }) {
    await axios.get('http://localhost:8080/students/').then((res) => {
      commit('setStudents', res.data)
    })
  },
  async addStudent({ commit }: { commit: Commit }, student: IStudent) {
    await axios.post('http://localhost:8080/students/', student).then((res) => {
      commit('addStudent', res.data)
    })
  },
  async deleteStudent({ commit }: { commit: Commit }, student: IStudent) {
    await axios
      .delete(`http://localhost:8080/students/${student.id}`)
      .then(() => {
        commit('deleteStudent', student)
      })
  },
}
