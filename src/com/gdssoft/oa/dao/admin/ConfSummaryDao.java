package com.gdssoft.oa.dao.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.core.dao.BaseDao;

/**
 * @description ConfSummaryDao
 * @author YHZ
 * @data 2010-10-8 PM
 * 
 */
public interface ConfSummaryDao extends BaseDao<ConfSummary> {

	/**
	 * @description 发送
	 */
	ConfSummary send(ConfSummary cm, String fileIds);

	/**
	 * @description 保存
	 */
	ConfSummary save(ConfSummary cm, String fileIds);
	
	int searchUsr_Role(Long userId);
	int searchConfAt_Summary(Long userId,Long confId);

}