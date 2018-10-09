package com.gdssoft.oa.dao.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.info.NoticeDao;
import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.Notice;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class NoticeDaoImpl extends BaseDaoImpl<Notice> implements NoticeDao {

	public NoticeDaoImpl() {
		super(Notice.class);
	}

	@Override
	public List<Notice> findBySearch(Notice notice, Date from, Date to,
			PagingBean pb) {
		StringBuffer hql = new StringBuffer("from Notice notice where 1=1");
		List params = new ArrayList();
		if(!"".equals(notice.getPostName())&&notice.getPostName()!=null){
			hql.append("and notice.postName like ?");
			params.add("%"+notice.getPostName()+"%");
		}
		if(!"".equals(notice.getNoticeTitle())&&notice.getNoticeTitle()!=null){
			hql.append("and notice.noticeTitle like ?");
			params.add("%"+notice.getNoticeTitle()+"%");
		}
		if(from!=null){
			hql.append("and notice.effectivDate > ?");
			params.add(from);
		}
		if(to!=null){
			hql.append("and notice.expirationDate < ?");
			params.add(to);
		}
		return findByHql(hql.toString(), params.toArray(), pb);
	}

	@Override
	public List<Notice> findByNoticeId(Long noticeId, PagingBean pb) {
		final String hql = "from Notice notice where notice.noticeId=?";
		Object[] params ={noticeId} ;
		return findByHql(hql, params, pb);
	}

	@Override
	public List<Notice> findBySearch(String searchContent, PagingBean pb) {
		ArrayList params=new ArrayList();
		StringBuffer hql = new StringBuffer("from Notice nt where 1=1");
		if(StringUtils.isNotEmpty(searchContent)){
			hql.append(" and (nt.noticeTitle like ? or nt.noticeContent like ?) order by nt.createtime desc,nt.updateTime desc");
			params.add("%"+searchContent+"%");
			params.add("%"+searchContent+"%");
		}
		hql.append(" order by nt.noticeId desc");
		return findByHql(hql.toString(),params.toArray(), pb);
	}
	public List<Notice> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb)
	{
		ArrayList params=new ArrayList();
		StringBuffer hql = new StringBuffer("from Notice nt where nt.state = ?");
		params.add(Constants.FLAG_ACTIVATION);	
		if(StringUtils.isNotEmpty(searchContent)){
			hql.append(" and (nt.noticeTitle like ? or nt.noticeContent like ?)");
			params.add("%"+searchContent+"%");
			params.add("%"+searchContent+"%");
		}
		//hql.append(" order by nt.noticeId desc");
		hql.append(" and nt.auditingStatus=? order by nt.ordertop desc, nt.updateTime desc");
		params.add(auditingStatus);		
		return findByHql(hql.toString(),params.toArray(), pb);
	}
	@Override
	public List<Notice> getDaibanNotice(AppUser user,PagingBean pb) 
	{

		// TODO Auto-generated method stub
 
		List<Notice> list = new ArrayList<Notice>();
		boolean isAdmin = false;
		for (AppRole role : (user.getRoles()).toArray(new AppRole[0])) {
			if (role.getRoleId() == -1L)// 管理员权限
			{
				isAdmin = true;
				break;
			}
		}
		String hql= "";
		String condstr = "";
		ArrayList<Object> paramList = new ArrayList<Object>();
		hql = " from Notice n  where n.auditingStatus=0 ";
		if (!isAdmin)// 非管理员需要过滤所在部门
		{
			if (user.getUserId() == user.getDepartment().getAppUser().getUserId())
			{				
				condstr = " and n.department.id=? ";
				hql += condstr;	
				paramList.add(user.getDepartment().getDepId());								
				list = findByHql(hql, paramList.toArray(),pb);
			}
		}
		else
		{
			list = findByHql(hql, paramList.toArray(),pb);
		}						
		return list;
	
	}
}
