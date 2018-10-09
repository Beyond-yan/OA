package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.system.ReportParamDao;
import com.gdssoft.oa.model.system.ReportParam;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ReportParamDaoImpl extends BaseDaoImpl<ReportParam> implements ReportParamDao{

	public ReportParamDaoImpl() {
		super(ReportParam.class);
	}

	@Override
	public List<ReportParam> findByRepTemp(Long reportId) {
		String hql="from ReportParam vo where vo.reportTemplate.reportId=? order by vo.sn asc";
		Object []objs={reportId};
		return findByHql(hql, objs);
	}

}