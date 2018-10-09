package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/


import com.gdssoft.oa.dao.system.DepartmentAllDao;
import com.gdssoft.oa.model.system.DepartmentAll;
import com.gdssoft.oa.service.system.DepartmentAllService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DepartmentAllServiceImpl extends BaseServiceImpl<DepartmentAll> implements
		DepartmentAllService {

	private DepartmentAllDao dao;
	
	public DepartmentAllServiceImpl(DepartmentAllDao dao) {
		super(dao);
		this.dao=dao;
	}
}
