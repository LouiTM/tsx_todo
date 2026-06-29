package com.example.TSX_todoApp.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.TSX_todoApp.todo;

@Mapper
public interface todoMapper {

	List<todo> showTodo();

	int insert(@Param("todo") todo todo);

	int update(@Param("todo") todo todo);

	boolean delete(int id);

	List<todo> filterByStatus(String status);
}