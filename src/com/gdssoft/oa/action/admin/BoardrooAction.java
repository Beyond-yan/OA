package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.logging.Log;
import org.apache.struts2.ServletActionContext;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.ConfRoomEquip;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.BoardrooService;
import com.gdssoft.oa.service.admin.ConfRoomEquipService;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class BoardrooAction extends BaseAction {
	@Resource
	private BoardrooService boardrooService;
	private Boardroo boardroo;

	private ConfRoomEquipService confRoomEquipService;
	@Resource
	private ConferenceService conferenceService;

	ConfRoomEquip[] confRoomEqs = null;

	public ConfRoomEquipService getConfRoomEquipService() {
		return confRoomEquipService;
	}

	public void setConfRoomEquipService(
			ConfRoomEquipService confRoomEquipService) {
		this.confRoomEquipService = confRoomEquipService;
	}

	private Long roomId;
	protected transient final Log log = LogFactory.getLog(getClass());

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public Boardroo getBoardroo() {
		return boardroo;
	}

	public void setBoardroo(Boardroo boardroo) {
		this.boardroo = boardroo;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		List<Boardroo> list = boardrooService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"createDate", "updateDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {
		log.info("删除会议室");
		String msg = "";
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				confRoomEquipService.delete(new Long(id));
				HttpServletRequest request = ServletActionContext.getRequest();
				QueryFilter filter = new QueryFilter(request);
				filter.addFilter("Q_roomId_L_EQ", id);// 会议室的ID为id的会议
				filter.addFilter("Q_applyStatus_SN_NEQ", "-1"); // 不包含已完成的会议
				filter.addFilter("Q_applyStatus_SN_NEQ", "3"); // 会议被退回的会议
				filter.addFilter("Q_applyStatus_SN_NEQ", "4"); // 会议取消的会议
				List<Conference> list = conferenceService.getAll(filter);// 查找某会议室有没有被申请（包括申请中、审核通过的）
				System.out.println("id:" + id);
				System.out.println("list:" + list.size());
				if (list.size() > 0) {
					log.debug("会议室已被申请，不能删除");
					msg = "会议室已被申请，不能删除！";
					setJsonString("{failure:true,msg:'" + msg + "'}");
				} else {
					log.debug("成功删除所选记录");
					boardrooService.remove(new Long(id));
					msg = "成功删除所选记录！";
					setJsonString("{success:true,msg:'" + msg + "'}");
				}
			}
		}
		log.info("完成删除会议室");
		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		Boardroo boardroo = boardrooService.get(roomId);
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(boardroo));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		AppUser user = ContextUtil.getCurrentUser();
		boardroo.setCreateBy(user.getFullname());
		// Date date=new Date(getNow());
		Date date1 = new Date();
		boardroo.setCreateDate(date1);
		Boardroo boardroo1 = null;
		Long roomID;
		if (boardroo.getRoomId() == null) {
			QueryFilter filter = new QueryFilter(getRequest());

			List<Boardroo> list = boardrooService.getAll(filter);

			if (list != null) {

				for (int i = 0; i < list.size(); i++) {
					// System.out.println("=======6666======="+boardroo.getCode().trim()==list.get(i).getCode().trim());

					if (boardroo.getCode().trim()
							.equals(list.get(i).getCode().trim())) {
						setJsonString("{again:true}");
						return SUCCESS;
					}
				}
			}

			boardroo1 = boardrooService.save(boardroo);
		} else {

			Boardroo orgBoardroo = boardrooService.get(boardroo.getRoomId());
			try {

				BeanUtil.copyNotNullProperties(orgBoardroo, boardroo);
				boardrooService.save(orgBoardroo);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		// 保存添加物品
		String details = getRequest().getParameter("details");
		if (StringUtils.isNotEmpty(details)) {
			Gson gson = new Gson();
			confRoomEqs = (ConfRoomEquip[]) gson.fromJson(details,
					ConfRoomEquip[].class);
			if (confRoomEqs != null) {
				for (ConfRoomEquip confRoomEq : confRoomEqs) {
					if (boardroo.getRoomId() == null) {
						roomID = boardroo1.getRoomId();
					} else {
						roomID = boardroo.getRoomId();
					}
					confRoomEq.setRoomId(roomID);
					confRoomEq.setCreateBy(user.getFullname());
					confRoomEq.setCreateDate(date1);
					if (confRoomEq.getId() == null) {
						confRoomEquipService.save(confRoomEq);
					} else {
						ConfRoomEquip orgConfRoomEquip = confRoomEquipService
								.get(confRoomEq.getId());
						try {
							BeanUtil.copyNotNullProperties(orgConfRoomEquip,
									confRoomEq);
							confRoomEquipService.save(orgConfRoomEquip);
						} catch (Exception ex) {
							logger.error(ex.getMessage());
						}
					}
				}
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/*
	 * //获取当前时间 public static String getNow() { SimpleDateFormat simpleFormat =
	 * new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); Date now = new Date();
	 * return simpleFormat.format(now); }
	 */
	
	/**
	 * 显示会议室，及其一个星期的使用情况
	 */
	public String listConference() {
		HttpServletRequest request = getRequest();
		String roomId = request.getParameter("roomId");
		String startTime01 = request.getParameter("startTime");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar c =  Calendar.getInstance();
		Long roomID;
		Date startTime = null;
		if(null == roomId || "" == roomId){
			roomID = new Long(-1);
		}else{
			roomID = new Long(roomId);
		}
		if(null == startTime01 || "" == startTime01){
			try {
				c.setTime(sdf.parse(sdf.format(c.getTime())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			startTime = c.getTime();
		}else{
			try {
				startTime = sdf.parse(startTime01);
				c.setTime(startTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		System.out.println(c.getTime());
		c.add(Calendar.DATE,7);
		Date endTime = c.getTime();
		System.out.println(c.getTime());
		
		List<Boardroo> list = boardrooService.listConference(roomID, startTime, endTime);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"createDate", "updateDate","startTime","endTime","createDate"});
		json.exclude(new String[] { "class" }).include("roomId","confs","confs.contUser.fullname");
		buff.append(json.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
}
