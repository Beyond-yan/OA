package com.gdssoft.oa.service.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.info.InMessage;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface InMessageService extends BaseService<InMessage> {

	/**
	 * 读出最新的一条未读信息
	 */
	public InMessage findByRead(Long userId);
	public Integer findByReadFlag(Long userId);
	public List<InMessage> findAll(Long userId,PagingBean pb);
	public List findByUser(Long userId,PagingBean pb);
	public List searchInMessage(Long userId,InMessage inMessage,ShortMessage shortMessage,Date from,Date to,PagingBean pb);
	/**
	 * 查找最新的一条信息
	 * @param userId
	 * @return
	 */
	public InMessage findLatest(Long userId);
}
