package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.OdCirPaper;
import com.gdssoft.oa.model.archive.OdCirUser;
import com.gdssoft.oa.model.system.AppUser;

public interface OdCirPaperService extends BaseService<OdCirPaper>{
	
	public String startCirSubFlow(Long defId,OdCirPaper odCirPaper,String processName,String activityName,String flowAssignIds,AppUser createUser);
	
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
	public List<OdCirPaper> searchBySender(Long senderUserId, String subject,String senderName,String recName,String isRead,PagingBean pb);

}


