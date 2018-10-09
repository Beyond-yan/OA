package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.hrm.JobChangeDao;
import com.gdssoft.oa.model.hrm.JobChange;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class JobChangeDaoImpl extends BaseDaoImpl<JobChange> implements JobChangeDao{

	public JobChangeDaoImpl() {
		super(JobChange.class);
	}

}