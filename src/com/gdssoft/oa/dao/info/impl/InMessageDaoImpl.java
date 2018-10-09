package com.gdssoft.oa.dao.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.cfg.Configuration;

import com.gdssoft.oa.dao.info.InMessageDao;
import com.gdssoft.oa.model.info.InMessage;
import com.gdssoft.oa.model.info.NewsType;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class InMessageDaoImpl extends BaseDaoImpl<InMessage> implements InMessageDao {

	public InMessageDaoImpl() {
		super(InMessage.class);
	}

	/**
	 * 读出最新的一条未读信息
	 */
	@Override
	public InMessage findByRead(Long userId) {
		String hql="from InMessage vo where vo.readFlag=0 and vo.delFlag=0 and vo.userId=?";
		Object[] objs = {userId};
		List<InMessage> list = findByHql(hql, objs);
		if(list.size()>0){
		return (InMessage)list.get(list.size()-1);
		}else{
			return null;
		}
	}
	

	@Override
	public Integer findByReadFlag(Long userId) {
		
		String hql="select count(*) from InMessage vo where vo.readFlag=0 and vo.delFlag=0 and vo.userId= ?";
		Object count=findUnique(hql,new Object[]{userId});
		return new Integer(count.toString());
		
	}

	@Override
	public List<InMessage> findAll(Long userId, PagingBean pb) {
		String hql="from InMessage vo where vo.userId=?";
		Object[] objs={userId};
		return findByHql(hql, objs,pb);
	}

	@Override
	public List<InMessage> findByShortMessage(ShortMessage shortMessage,PagingBean pb) {
		String hql="from InMessage vo1,ShortMessage vo2 where vo1.shortMessage=?";
		Object[] objs={shortMessage};
		return findByHql(hql, objs,pb);
	}

	@Override
	public List findByUser(Long userId,PagingBean pb) {
		String hql="select vo1,vo2 from InMessage vo1 join vo1.shortMessage vo2 where vo2.msgType=1 and vo2.senderId=? order by vo2.sendTime desc";
		Object[] objs={userId};
		return findByHql(hql,objs,pb);
	}

	@Override
	public List findByUser(Long userId) {
		String hql="select vo1,vo2 from InMessage vo1 join vo1.shortMessage vo2 where  vo2.senderId=?";
		Object[] objs={userId};
		return findByHql(hql,objs);
	}

	/**
	 * 已经发出去的信息
	 */
	
	
	@Override
	public List searchInMessage(Long userId, InMessage inMessage,
			ShortMessage shortMessage, Date from, Date to, PagingBean pb) {
		StringBuffer hql=new StringBuffer("select vo1,vo2 from InMessage vo1 join vo1.shortMessage vo2 where  vo2.msgType=1 and vo2.senderId=?");
		ArrayList paramList=new ArrayList();
		paramList.add(userId);	
		if(to!=null){
			hql.append("and vo2.sendTime <= ?");
			paramList.add(to);
		}
		if(from!=null){
			hql.append("and vo2.sendTime >= ?");
			paramList.add(from);
		}
		if(shortMessage!=null){
			if(shortMessage.getMsgType()!=null){
				hql.append(" and vo2.msgType=?");
				paramList.add(shortMessage.getMsgType());
			}
		}
		if(inMessage!=null){
			if(StringUtils.isNotEmpty(inMessage.getUserFullname())){
				hql.append(" and vo1.userFullname like ?");
				paramList.add("%"+inMessage.getUserFullname()+"%");
			}
		}
		hql.append(" order by vo2.sendTime desc");
			
		return findByHql(hql.toString(), paramList.toArray(), pb);
	}

	@Override
	public InMessage findLatest(Long userId) {
		String hql="from InMessage vo where vo.delFlag=0 and vo.userId=?";
		Object[] objs = {userId};
		List<InMessage> list = findByHql(hql, objs);
		if(list.size()>0){
			return (InMessage)list.get(list.size()-1);
		}else{
			return null;
		}
	}

	
	
}
