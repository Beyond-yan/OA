package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.OdCirUser;

/**
 * 
 * @author 
 *
 */
public interface OdCirUserDao extends BaseDao<OdCirUser>{
	public List<OdCirUser> getListByCirPaperId(Long cirPaperId);
	public Long getRunIdByTadkId(Long taskId);
	public List<Long> getByUserAndRun(Long runId,Long userId);
	/**
	 * @category 根据当前的用户以及传入的条件查询传阅件信息
	 * @param senderUserId 当前用户
	 * @param subject 传阅件主题
	 * @param senderName 传送人
	 * @param recName 被传送人
	 * @param isRead 是否已阅
	 * @param pb 分页
	 * @return 传阅件列表包含的是传阅件id以及主题信息
	 */
	public List<OdCirUser> searchBySender(Long senderUserId, String subject,String senderName,String recName,String isRead, PagingBean pb);
	
	/**
	 * @author F3225932
	 * @category 根据当前的用户以及传阅件id查询相关的传阅件
	 * @param senderUserId 当前用户
	 * @param cirPaperId  传阅件id
	 * @param pb 分页
	 * @return 传阅件列表
	 */
	public List<OdCirUser> searchByPaperId(Long senderUserId,Long cirPaperId, PagingBean pb);

}