package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/

import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.info.InMessageDao;
import com.gdssoft.oa.model.info.InMessage;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.service.info.InMessageService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class InMessageServiceImpl extends BaseServiceImpl<InMessage> implements
		InMessageService {

	private InMessageDao dao;
	public InMessageServiceImpl(InMessageDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public InMessage findByRead(Long userId) {
		return dao.findByRead(userId);
	}
	@Override
	public Integer findByReadFlag(Long userId) {
		return dao.findByReadFlag(userId);
	}
	@Override
	public List<InMessage> findAll(Long userId, PagingBean pb) {
		return dao.findAll(userId, pb);
	}
	@Override
	public List findByUser(Long userId, PagingBean pb) {
		return dao.findByUser(userId, pb);
	}
	@Override
	public List searchInMessage(Long userId, InMessage inMessage,
			ShortMessage shortMessage, Date from, Date to, PagingBean pb) {
		return dao.searchInMessage(userId, inMessage, shortMessage, from, to, pb);
	}
	@Override
	public InMessage findLatest(Long userId) {
		return dao.findLatest(userId);
	}

}
