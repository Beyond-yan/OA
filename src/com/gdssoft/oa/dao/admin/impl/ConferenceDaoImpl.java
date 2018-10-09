package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.admin.ConfPrivilegeDao;
import com.gdssoft.oa.dao.admin.ConferenceDao;
import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.dao.system.FileAttachDao;
import com.gdssoft.oa.model.admin.ConfPrivilege;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;

/**
 * @description ConferenceDaoImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
@SuppressWarnings("unchecked")
public class ConferenceDaoImpl extends BaseDaoImpl<Conference> implements
		ConferenceDao {
	/*
	 * private static SimpleDateFormat sdf = new SimpleDateFormat(
	 * "yyyy-MM-dd HH:mm:ss");
	 */

	private static SimpleDateFormat sdf = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
	@Resource
	private FileAttachDao fileAttachDao;
	@Resource
	private AppUserDao appUserDao;
	@Resource
	private ConfPrivilegeDao confPrivilegeDao;

	public ConferenceDaoImpl() {
		super(Conference.class);
	}

	/**
	 * @description 根据会议标题模糊分页查询，参数：confTopic会议标题,pb即PagingBean对象
	 */
	@Override
	public List<Conference> getConfTopic(String confTopic, PagingBean pb) {
		Date nowDate = new Date();
		Long userId = ContextUtil.getCurrentUserId();
		ArrayList<String> paramList = new ArrayList<String>();
		/*
		 * StringBuffer bf = new StringBuffer(
		 * "select c from Conference c,ConfPrivilege p where c.confId=p.confId "
		 * );
		 */
		StringBuffer bf = new StringBuffer(
				"select c from Conference c where   c.sendtime <=  ");
		// bf.append("and p.rights=3 and p.userId=" + userId);
		paramList.add(nowDate.toString());
		if (confTopic != null && !confTopic.isEmpty()) {
			bf.append(" and c.confTopic like ? ");
			paramList.add("%" + confTopic + "%");
		}
		logger.debug("可创建会议纪要的HQL：" + bf.toString());
		return findByHql(bf.toString(), paramList.toArray(), pb);
	}

	/**
	 * @description 根据userId查询fullName,返回fullName组成的字符串
	 */
	public String baseUserIdSearchFullName(String userIds) {
		String fullNames = "";
		for (String userId : userIds.split(",")) {
			fullNames += appUserDao.get(new Long(userId)).getFullname() + ",";
		}
		return fullNames.substring(0, fullNames.length() - 1);
	}

	/**
	 * @description 会议发送[保存Conference,Mail]
	 */
	public Conference send(Conference conference, String view, String updater,
			String summary, String fileIds) {
		// AppUser appUser = ContextUtil.getCurrentUser();
		// 发送邮件
		if (conference.getIsEmail() != null && conference.getIsEmail() == 1) {

		}
		// 短信提示
		if (conference.getIsMobile() != null && conference.getIsMobile() == 1) {

		}
		return temp(conference, view, updater, summary, fileIds);
	}

	/**
	 * @description 会议暂存
	 */
	public Conference temp(Conference conference, String view, String updater,
			String summary, String fileIds) {
		// 获取附件信息
		if (fileIds != null && !fileIds.isEmpty()) {
			Set<FileAttach> set = new HashSet<FileAttach>();
			for (String f : fileIds.split(",")) {
				FileAttach fa = fileAttachDao.get(new Long(f));
				set.add(fa);
			}
			conference.setAttachFiles(set);
		}
		Conference cf = super.save(conference);

		Set<ConfPrivilege> sett = new HashSet<ConfPrivilege>();
		// 查看人 cxt201112
		// setConfPrivilege(cf.getConfId(), view, 1, sett);
		// 修改人
		// setConfPrivilege(cf.getConfId(), updater, 2, sett);
		// 创建纪要人
		// setConfPrivilege(cf.getConfId(), summary, 3, sett);
		// 删除原来的权限
		// confPrivilegeDao.delete(cf.getConfId());
		// 保存
		// cf.setConfPrivilege(sett);
		return super.save(cf);
	}

	/**
	 * @description 根据会议室编号判断在输入的时间段内是否会议室可用,可用返回success,不可用返回不可用的时间段
	 */
	@Override
	public String judgeBoardRoomNotUse(Long confId, Date startTime,
			Date endTime, Long roomId, Date confStartTime, Date confEndTime) {
		ArrayList<Object> paramList = new ArrayList<Object>();		
		String msg = "success";
		logger.debug("startTime:"+startTime+" endTime:"+endTime+" roomId:"+roomId+" confId:"+confId);
		// 查询不是长期申请会议室的parent笔并且是已经申请或者被审核过的数据
		String hql = "select t from Conference t where t.roomId = ? and t.applyStatus in (1,2) and  t.isLong !=2 and ";
//		hql += "((CONVERT(varchar(16),t.startTime,20) <=  CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) >=CONVERT(varchar(16),?,20))  ";
//		hql += " or (CONVERT(varchar(16),t.startTime,20)>= CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.startTime,20) < CONVERT(varchar(16),?,20))  ";
//		hql += " or (CONVERT(varchar(16),t.endTime,20) > CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) <=CONVERT(varchar(16),?,20))) ";
		
		hql += "((t.startTime <=  ? and t.endTime >=?)   ";
		hql += " or (t.startTime>= ?  and t.startTime < ?)   ";
		hql += " or (t.endTime > ?  and t.endTime <= ? )) ";
//CONVERT(varchar(23),t.startTime,100)  100：将日期转换成     02  3 2012 11:47AM  格式，只精确到分进行判断		
		paramList.add(roomId);		
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);		
		if (null != confId) {			
			logger.debug("-------confId------：" + confId);
			hql += " and t.confId != ?";
			paramList.add(confId);			
			/*hql += "  and t.parentConfId != ?";
			paramList.add(confId);*/
		}		
		System.out.println("LastHql:"+hql);
		List<Conference> list = findByHql(hql, paramList.toArray());
		System.out.println("会议室重复list：" + list+" list的大小："+list.size());
		logger.debug("会议室重复list：" + list+" list的大小："+list.size());		
		if (list != null && list.size() > 0) {
			Conference conference = list.get(0);
			msg = conference.getRoomName() + "会议室，在"
					+ sdf.format(confStartTime) + " 至 "
					+ sdf.format(confEndTime)
					+ "这段时间不可使用，请选择其他时间段！";
		} else
			msg = "success";
		logger.debug("Conference中判断会议室是否可用：" + hql);
		return msg;
	}
	/**
	 * @description 根据会议室编号判断在输入的时间段内是否会议室可用,可用返回success,不可用返回不可用的时间段
	 */
	public boolean getBoardRoomNotUse(Long confId,Date startTime,
			Date endTime, Integer timeType,Long roomId){
		ArrayList<Object> paramList = new ArrayList<Object>();
		List list = new ArrayList();
		String hql = "select * from Conference t where t.roomId = ? and t.APPLY_STATUS in (1,2) and TRUNC(t.startTime) = ?";
		paramList.add(roomId);
		paramList.add(startTime);
		if(2 != timeType){
			hql += " and (t.TIME_TYPE = ? or t.TIME_TYPE = 2)";
			paramList.add(timeType);
		}
		if(null != confId){
			hql += " and t.CONFID != ?";
			paramList.add(confId);
		}
		/*if(timeType == 0 || timeType == 1){
			sql = "SELECT * FROM Conference WHERE apply_Status != 3 AND (( startTime = ? AND time_type = ? ) OR ";
			sql += "( startTime <= ? AND endTime > ? AND time_type = 2 )) AND roomId = ?";
			paramList.add(startTime);
			paramList.add(timeType);
			paramList.add(startTime);
			paramList.add(startTime);
			paramList.add(roomId);
		}
		if(timeType == 2){
			sql ="SELECT * FROM Conference WHERE apply_Status != 3 AND ((? <= startTime AND  startTime<? AND time_type IN(0,1)) OR ";
			sql += "(startTime <= ? AND endTime > ? AND time_type=2) OR";
			sql += " (startTime < ? AND endTime >= ?  AND time_type=2) OR (startTime>=? AND endTime<=? AND time_type = 2))AND roomId = ?";
			paramList.add(startTime);
			paramList.add(endTime);
			paramList.add(startTime);
			paramList.add(startTime);
			paramList.add(endTime);
			paramList.add(endTime);
			paramList.add(startTime);
			paramList.add(endTime);
			paramList.add(roomId);
		}*/
		System.out.println("sql="+hql);
		list= this.jdbcTemplate.queryForList(hql, paramList.toArray());
		return list.size()>0;
	}
	/**
	 * @description 会议审批
	 */
	@Override
	public String apply(Long confId, String checkReason, boolean bo) {
		int status = bo ? 1 : 2;
		Conference conference = get(confId);
		// conference.setStatus((short) status);
		conference.setCheckReason(checkReason);
		conference.setApplyStatus((short) status);

		return "success";
	}
	// ########私用方法#######//
	/**
	 * @description 添加会议权限
	 */
	private void setConfPrivilege(Long confId, String ids, int type,
			Set<ConfPrivilege> set) {
		ConfPrivilege cp;
		for (String id : ids.split(",")) {
			AppUser appUser = appUserDao.get(new Long(id));
			cp = new ConfPrivilege();
			cp.setConfId(confId);
			cp.setUserId(appUser.getUserId());
			cp.setFullname(appUser.getFullname());
			cp.setRights((short) type);
			set.add(cp);
		}
	}

	@Override
	public List<Conference> getPicBoardRoom(Date startTime, Date endTime,
			Long roomId) {
		ArrayList<Object> paramList = new ArrayList<Object>();

		/*paramList.add(sdf.format(startTime));
		paramList.add(sdf.format(endTime));*/
		paramList.add(startTime);
		paramList.add(endTime);
		String hql = "from  Conference cf "
				+ " where cf.startTime>=? and cf.endTime<=? "
				//+ " where cf.startTime>= Convert(varchar(23),?) and  cf.endTime<= Convert(varchar(23),?) "
				+ "and cf.applyStatus in(1,2)  and cf.isLong not in ( 2 ) ";
		if (roomId != -1) {
			hql = hql + " and  cf.roomId=?  ";
			paramList.add(roomId);
		}
		hql = hql + " order by cf.roomId ,cf.startTime asc ";
		
		List<Conference> list = findByHql(hql, paramList.toArray());
		System.out.println("list大小:"+ list.size());
		return list;
	}

	// 查询不是已完成并是长期会议的子会议
	@Override
	public List<Conference> getLongConfSub(Long parentConfId) {
		// TODO Auto-generated method stub
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = " from Conference cf where cf.isLong=1 and cf.applyStatus not in (-1) and  cf.parentConfId= ?";
		paramList.add(parentConfId);
		List<Conference> list = findByHql(hql, paramList.toArray());
		return list;
	}

	@Override
	public String delSubConf(Long parentConfId) {
		// TODO Auto-generated method stub

		// TODO Auto-generated method stub
		String msg = "success";
		try {
			String sql = "delete  from  Conference   where  is_Long=1 and  apply_Status not in (-1) and parent_Conf_Id= "
					+ parentConfId;
			this.jdbcTemplate.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			msg = "操作失败！";
		}
		return msg;

	}/*
	 * 
	 * @Override public String notUsedBoardRoomForLongConf(Long confId, Date
	 * startTime, Date endTime, Long roomId, Long parentConfId) {
	 * ArrayList<Object> paramList = new ArrayList<Object>(); String msg =
	 * "success"; String hql =
	 * "select t from Conference t where t.roomId = ? and t.status=1 and "; hql
	 * +=
	 * "t.startTime <= to_date(?,'yyyy-mm-dd hh24:mi:ss') and t.endTime >= to_date(?,'yyyy-mm-dd hh24:mi:ss') "
	 * ;
	 * 
	 * //查询不是长期申请会议室的parent笔并且是已经申请或者被审核过的数据 String hql =
	 * "select t from Conference t where t.roomId = ? and t.applyStatus in (1,2) and  t.isLong not in (2) and "
	 * ; hql +=
	 * "((t.startTime <=  CONVERT(varchar(23),?) and t.endTime >=CONVERT(varchar(23),?))  "
	 * ; hql +=
	 * " or (t.endTime >= CONVERT(varchar(23),?) and t.endTime <=CONVERT(varchar(23),?))  "
	 * ; hql +=
	 * " or (t.startTime >= CONVERT(varchar(23),?) and t.startTime <= CONVERT(varchar(23),?))) "
	 * ;
	 * 
	 * // select CONVERT(varchar(23), '2011-05-06 09:06:65', 120 )
	 * 
	 * paramList.add(roomId); paramList.add(sdf.format(startTime));
	 * paramList.add(sdf.format(endTime)); paramList.add(sdf.format(startTime));
	 * paramList.add(sdf.format(endTime)); paramList.add(sdf.format(startTime));
	 * paramList.add(sdf.format(endTime)); if(null!=confId){ hql +=
	 * " and t.confId != ?"; paramList.add(confId); } if(null!=parentConfId){
	 * 
	 * hql += "  and t.parentConfId != ?"; paramList.add(parentConfId);
	 * 
	 * 
	 * } List<Conference> list = findByHql(hql, paramList.toArray()); if (list
	 * != null && list.size() > 0) {
	 * 
	 * Conference conference = list.get(0); msg = conference.getRoomName() +
	 * "会议室，在" + sdf.format(conference.getStartTime()) + " 至 " +
	 * sdf.format(conference.getEndTime()) + "这段时间不可使用，请选择其他时间段！"; } else msg =
	 * "success"; logger.debug("Conference中判断会议室是否可用：" + hql); return msg; }
	 */

	@Override
	public List<Conference> getDaibanConf(String empId) {
		// TODO Auto-generated method stub
		//查找会议室管理员的角色id
		String sql="select roleid from app_role where rolename='会议室管理员'";
		int roleid=this.jdbcTemplate.queryForInt(sql);
		String sqlUserId="select userid from app_user where username='"+empId +"'";
		
		int userId=this.jdbcTemplate.queryForInt(sqlUserId);
		
		//判断当前用户是否有权限审核会议室记录
		String sqlCharge="select count(1) from user_role where userid="+ userId +"  and  roleid in ("+ roleid   +")";
		
		int countNum=this.jdbcTemplate.queryForInt(sqlCharge);
		
		if(countNum>0){
		//如果传进来的用户有会议室管理员的身份，则返回待审核的记录
			
			//ArrayList<Object> paramList = new ArrayList<Object>();
		

		/*	paramList.add(1);//表示查询状态只在申请中的会议记录
			paramList.add(1);//表示长期会议记录中只要求显示父笔的会议			
*/			
			
	/*	QueryFilter filter=new QueryFilter(null);
		filter.addFilter("Q_applyStatus_SN_EQ", "1");//表示查询状态只在申请中的会议记录
		filter.addFilter("Q_isLong_SN_NEQ", "1");//表示长期会议记录中只要求显示父笔的会议
		ConferenceDao dao;*/
			
		//c.applyStatus=1:表示查询状态只在申请中的会议记录
		//c.isLong not in (1):表示长期会议记录中只要求显示父笔的会议	
			String hql="from Conference  c where c.applyStatus=1 and c.isLong not in (1) ";
		List<Conference> confList=findByHql(hql);
		return confList;		
		}	
		else {
			return null;					
		}		
	}
	
	public List<Conference> getConferenceByRoom(Long roomId, Date startTime, Date endTime){
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = "from Conference  c where c.applyStatus in (1,2) AND c.roomId = ? and ((c.startTime >=? and c.startTime <?) OR ";
				hql += "(c.endTime >? and c.endTime <=?) OR (c.startTime<? AND c.endTime>?)) order by c.startTime asc,c.timeType asc";
		paramList.add(roomId);
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);
		List<Conference> list = findByHql(hql, paramList.toArray());
		return list;
	}
	/**
	 * 自动结束schema下的会议
	 * @param schemaCode
	 * @param status
	 * @param conferenceId
	 * @param updateUser
	 */
	public void updateConferenceStatus(String schemaCode,int status,String updateUser){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode + ".";
		String sql = "UPDATE "+ schemaCode + "conference"
				+" SET apply_status= :status,update_by= :updateUser,update_date=sysdate"
				+" WHERE endtime<sysdate and apply_status=2";
		Query query = getSession().createSQLQuery(sql)
				.setParameter("status", status)
				.setParameter("updateUser", updateUser);
		query.executeUpdate();
	}
}