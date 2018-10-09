package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.info.NoticeDao;
import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.Notice;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.NoticeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * @author 谢宏溪
 *
 */
public class NoticeServiceImpl extends BaseServiceImpl<Notice> implements
		NoticeService {
	private NoticeDao noticeDao;
	
	public NoticeServiceImpl(NoticeDao noticeDao) {
		super(noticeDao);
		this.noticeDao = noticeDao;
	}

	@Override
	public List<Notice> findByNoticeId(Long noticeId, PagingBean pb) {
		return noticeDao.findByNoticeId(noticeId, pb);
	}

	@Override
	public List<Notice> findBySearch(Notice notice, Date from, Date to,
			PagingBean pb) {
		return noticeDao.findBySearch(notice, from, to, pb);
	}

	@Override
	public List<Notice> findBySearch(String searchContent, PagingBean pb) {
		return noticeDao.findBySearch(searchContent,pb);
	}
	//add by smart on 20110520
	@Override
	public List<Notice> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb) {
		return noticeDao.findBySearch(searchContent,auditingStatus,pb);
	}
	@Override
	public List<Notice> getDaibanNotice(AppUser user,PagingBean pb) 
	{
		return noticeDao.getDaibanNotice(user, pb);
	}
	
}
