package com.gdssoft.oa.dao.work.impl;

import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.work.WorkContentProcessDao;
import com.gdssoft.oa.model.work.WorkContentProcess;

public class WorkContentProcessDaoImpl extends BaseDaoImpl<WorkContentProcess> implements WorkContentProcessDao{

	public WorkContentProcessDaoImpl() {
		super(WorkContentProcess.class);
	}

	public List<WorkContentProcess> getProcessListById(Long workContentId){
		String hql = "from WorkContentProcess wcp where wcp.workContentId =? order by wcp.createtime asc";
		Object[] params = { workContentId };
		List<WorkContentProcess> list = findByHql(hql, params);
		return list;
	}
}
