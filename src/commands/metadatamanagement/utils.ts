export default {
  sortFieldsByApiName: (a: any, b: any) => {
    if (a.fullName > b.fullName) { return 1 }
    else if (a.fullName < b.fullName) { return -1 }
    return 0
  }
}