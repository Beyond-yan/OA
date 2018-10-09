package com.gdssoft.oa.service.admin.impl;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */

import com.gdssoft.oa.dao.admin.ConfSummaryDao;
import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.oa.service.admin.ConfSummaryService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

/**
 * @description ConfSummarySerivceImpl
 * @author YHZ
 * @data 2010-10-8 PM
 * 
 */
public class ConfSummaryServiceImpl extends BaseServiceImpl<ConfSummary>
		implements ConfSummaryService {
	private ConfSummaryDao dao;

	public ConfSummaryServiceImpl(ConfSummaryDao dao) {
		super(dao);
		this.dao = dao;
	}

	/**
	 * @description 发送
	 * @param cm
	 *            ConfSummary
	 * @param fileIds
	 * @return ConfSummary
	 */
	public ConfSummary send(ConfSummary cm, String fileIds) {
		return dao.send(cm, fileIds);
	}

	/**
	 * @description 保存
	 * @param cm
	 *            ConfSummary
	 * @param fileIds
	 * @return ConfSummary
	 */
	public ConfSummary save(ConfSummary cm, String fileIds) {
		return dao.save(cm, fileIds);
	}

	@Override
	public int searchUsr_Role(Long userId) {
		// TODO Auto-generated method stub
		return dao.searchUsr_Role(userId);
	}

	@Override
	public int searchConfAt_Summary(Long userId, Long confId) {
		// TODO Auto-generated method stub
		return dao.searchConfAt_Summary(userId, confId);
	}

}