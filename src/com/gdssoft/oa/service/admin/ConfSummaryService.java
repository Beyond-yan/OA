package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */

import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.core.service.BaseService;

/**
 * @description ConfSummaryService
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public interface ConfSummaryService extends BaseService<ConfSummary> {

	/**
	 * @description 发送
	 * @param cm
	 *            ConfSummary
	 * @param fileIds
	 *            附件ids
	 * @return ConfSummary
	 */
	ConfSummary send(ConfSummary cm, String fileIds);

	/**
	 * @description 保存
	 * @param cm
	 *            ConfSummary
	 * @param fileIds
	 * @return ConfSummary
	 */
	ConfSummary save(ConfSummary cm, String fileIds);
	
	int searchUsr_Role(Long userId);
	int searchConfAt_Summary(Long userId,Long confId);
}
