package com.gdssoft.oa.service.point;

import java.util.ArrayList;
import java.util.List;

public class ToDoListResp {
	private List<ToDoBean> toDoList = new ArrayList<ToDoBean>();
	private String totlecount;
	private String resultcount;
	
	public void setTotlecount(String totlecount) {
		this.totlecount = totlecount;
	}
	public void setResultcount(String resultcount) {
		this.resultcount = resultcount;
	}
	public List<ToDoBean> getToDoList() {
		return toDoList;
	}
	public void addToDoBean(ToDoBean toDoBean) {
		this.toDoList.add(toDoBean);
	}

}
