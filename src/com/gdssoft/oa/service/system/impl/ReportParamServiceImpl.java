package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.ReportParamDao;
import com.gdssoft.oa.model.system.ReportParam;
import com.gdssoft.oa.service.system.ReportParamService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ReportParamServiceImpl extends BaseServiceImpl<ReportParam> implements ReportParamService{
	private ReportParamDao dao;
	
	public ReportParamServiceImpl(ReportParamDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<ReportParam> findByRepTemp(Long reportId) {
		return dao.findByRepTemp(reportId);
	}

}