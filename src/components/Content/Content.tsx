import React, { useEffect, useState } from "react"
import AddCategoryModal from "./AddCategoryModal"
import { Button, Box, Tab, TextField, List } from "@mui/material"
import category from "../../services/odevserver/controllers/category"
import TabContext from "@mui/lab/TabContext"
import TabPanel from "@mui/lab/TabPanel"
import TabList from "@mui/lab/TabList"
import CategoryList from "./CategoryList"
import CustomSelect from "./CustomSelect"
import TodoItem from "./TodoItem"
import EditCategoryStatusModal from "./EditCategoryStatusModal"
import useForm from "../../hooks/useForm"
import status from "../../services/odevserver/controllers/status"
import todo from "../../services/odevserver/controllers/todo"
function Content() {
  const [value, setValue] = useState("todo")
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState<boolean>(false)
  const [
    isEditCategoryStatusModalVisible,
    setIsEditCategoryStatusModalVisible,
  ] = useState<boolean>(false)

  const [categoryList, setCategoryList] = useState<Array<any>>([])
  const [statusList, setStatusList] = useState<Array<any>>([])
  const [todoList, setTodoList] = useState<Array<any>>([])

  useEffect(() => {
    category.list().then(({ data }) => setCategoryList(data))
  }, [])

  const handleAddCategory = (category: any) => {
    setCategoryList((prev) => [...prev, category])
    setIsAddCategoryModalVisible(false)
  }
  const handleUpdateCategory = (category: any) => {
    const newList = categoryList.map((item) =>
      item.id === category.id ? category : item
    )
    setCategoryList(newList)
  }
  const handleDeleteCategory = (id: any) => {
    const newList = categoryList.filter((item) => item.id !== id)
    setCategoryList(newList)
  }
  const form = useForm()
  useEffect(() => {
    if (form.values?.categoryId) {
      status
        .list({ categoryId: form.values?.categoryId })
        .then(({ data }) => setStatusList(data))
    }
  }, [form.values?.categoryId])
  const handleAddTodoClick = () => {
    todo
      .create({ ...form.values, title: form.values.newTodo })
      .then(({ data }) => {
        setTodoList((prev) => [...prev, data])
      })
  }
  useEffect(() => {
    todo.list({}).then(({ data }) => {
      setTodoList(data)
    })
  }, [])
  const handleTodoUpdate = (data:any) => {
    const newTodoList = todoList.map((todo) =>
      data.id === todo.id ? data : todo
    )
    setTodoList(newTodoList)
  }
  return (
    <div>
      <AddCategoryModal
        onCategorySubmit={handleAddCategory}
        open={isAddCategoryModalVisible}
        onClose={() => setIsAddCategoryModalVisible(false)}
      />
      <EditCategoryStatusModal
        open={Boolean(selectedCategory)}
        onClose={() => setSelectedCategory(0)}
        categoryId={selectedCategory}
      />

      <Box
        sx={{
          typography: "body1",
          backgroundColor: "white",
          marginX: "auto",
          marginY: 10,
          width: "800px",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab label="TODO" value="todo" />
              <Tab label="Categories" value="categories" />
            </TabList>
          </Box>
          <TabPanel value="todo">
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <TextField
                fullWidth
                sx={{ width: "50%", marginX: 1 }}
                name="newTodo"
                label="Todo"
                variant="outlined"
                onChange={form.handleChange}
              />
              <CustomSelect
                sx={{ width: "20%", marginX: 1 }}
                dataList={categoryList}
                name="categoryId"
                label="Kategori"
                titleField="title"
                valueField="id"
                keyField="id"
                onChange={form.handleSelectChange}
              />
              <CustomSelect
                sx={{ width: "20%", marginX: 1 }}
                dataList={statusList}
                name="statusId"
                label="Status"
                titleField="title"
                valueField="id"
                keyField="id"
                onChange={form.handleSelectChange}
              />

              <Button
                sx={{ width: "10%", marginX: 1 }}
                variant="contained"
                size="medium"
                onClick={handleAddTodoClick}
              >
                Ekle
              </Button>
            </Box>
            <Box>
              <List>
                {todoList.map((todo) => {
                  return (
                    <TodoItem
                      onUpdate={handleTodoUpdate}
                      data={todo}
                      categoryList={categoryList}
                    />
                  )
                })}
              </List>
            </Box>
          </TabPanel>
          <TabPanel value="categories">
            <CategoryList
              onShowStatusModal={(id: any) => setSelectedCategory(id)}
              categoryList={categoryList}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setIsAddCategoryModalVisible(true)}
            >
              Yeni kategori ekle
            </Button>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default Content
