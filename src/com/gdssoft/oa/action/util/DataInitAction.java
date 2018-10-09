package com.gdssoft.oa.action.util;

import javax.annotation.Resource;

import org.springframework.beans.factory.InitializingBean;

import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.service.flow.TaskService;

public class DataInitAction extends BaseAction implements InitializingBean{

	@Resource
	private TaskService service;
	
	public void afterPropertiesSet() throws Exception {
		service.init();
		System.out.println("数据主键初始化成功");
	}
}
