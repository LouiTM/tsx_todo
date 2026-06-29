package com.example.TSX_todoApp.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.TSX_todoApp.mapper.todoMapper;
import com.example.TSX_todoApp.requestTodo;
import com.example.TSX_todoApp.todo;

@RestController
@RequestMapping("/todos")
public class todoController {

    @Autowired
    todoMapper todomapper;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<todo> showTodo() {
        List<todo> todos = todomapper.showTodo();
        return todos;
    }
    
    @PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void doPost(@RequestBody todo todo) {
		todomapper.insert(todo);
	}

    @PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public void doPut(@RequestBody requestTodo todo, @PathVariable int id) {
		todo updatetodo = new todo();
		BeanUtils.copyProperties(todo, updatetodo);
		updatetodo.setId(id);
		todomapper.update(updatetodo);
	}

    @DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void doDelete(@PathVariable int id) {
		todomapper.delete(id);
	}

    @GetMapping("/{status}")
	@ResponseStatus(HttpStatus.OK)
	public List<todo> filterGet(@PathVariable String status) {
		List<todo> todos = todomapper.filterByStatus(status);
		return todos;
	}
}