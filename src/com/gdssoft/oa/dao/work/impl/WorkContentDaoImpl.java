package com.gdssoft.oa.dao.work.impl;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.work.WorkContentDao;
import com.gdssoft.oa.model.work.WorkContent;

public class WorkContentDaoImpl extends BaseDaoImpl<WorkContent> implements WorkContentDao{

	public WorkContentDaoImpl() {
		super(WorkContent.class);
	}

}
