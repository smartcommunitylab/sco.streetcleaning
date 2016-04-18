package it.smartcommunitylab.street.cleaning.scripts;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.TimeZone;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.MongoClient;

/*import it.smartcommunitylab.streetcleaning.model.events.WsnEvent;*/

public class UpdateEventTimestamps {

	public static void main(String[] args) throws Exception {
		MongoTemplate template = new MongoTemplate(new MongoClient(), "ClimbEventStore");
		
		/*List<WsnEvent> events = template.findAll(WsnEvent.class);
		for (WsnEvent event: events) {
			Update update = new Update();
			Date now = new Date();
			Date date = event.getTimestamp();
			Calendar cal1 = new GregorianCalendar(TimeZone.getDefault());
			cal1.setTime(now);
			Calendar cal2 = new GregorianCalendar(TimeZone.getDefault());
			cal2.setTime(date);
			cal2.set(Calendar.HOUR_OF_DAY, cal1.get(Calendar.HOUR_OF_DAY));
			cal2.add(Calendar.HOUR_OF_DAY, -1);
			cal2.set(Calendar.DAY_OF_MONTH, cal1.get(Calendar.DAY_OF_MONTH));
//			cal2.add(Calendar.DAY_OF_MONTH, -1);
			cal2.set(Calendar.MONTH, cal1.get(Calendar.MONTH));
			cal2.set(Calendar.YEAR, cal1.get(Calendar.YEAR));
			update.set("timestamp", cal2.getTime());

			Query query = new Query(new Criteria("timestamp").is(date).and("creationDate").is(event.getCreationDate()).and("lastUpdate").is(event.getLastUpdate()));
			
			WsnEvent updatedEvent = template.findAndModify(query, update, WsnEvent.class);
			
			System.out.println(updatedEvent.getRouteId() + " : " + updatedEvent.getTimestamp());
			
		}*/
	}
	
}
