package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.JobDao;
import com.gdssoft.oa.model.hrm.Job;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class JobDaoImpl extends BaseDaoImpl<Job> implements JobDao{

	public JobDaoImpl() {
		super(Job.class);
	}

	@Override
	public List<Job> findByDep(Long depId) {
		String hql="from Job vo where vo.department.depId=?";
		Object[] objs={depId};
		return findByHql(hql, objs);
	}

}