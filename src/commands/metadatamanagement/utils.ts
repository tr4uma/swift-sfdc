export default {
  sortFieldsByField: (a: any, b: any, fieldName: string) => {
    if (a[fieldName] > b[fieldName]) { return 1 }
    else if (a[fieldName] < b[fieldName]) { return -1 }
    return 0
  }
}